import { Component, Prop, State, h, Host } from '@stencil/core';
declare const window: any;

@Component({
  tag: 'usn-ad',
  styleUrl: 'usn-ad.css',
  shadow: false,
})
export class Ad {
  /**
   * The GPT slot
   */
  @State() slot: any;

  /**
   * Stores the media query listeners.
   */
  @State() mqListeners: Array<Function> = [];

  /**
   * The first name
   */
  @Prop() adId: string;

  /**
   * The ad unit name
   */
  @Prop() adUnitPath: string;

  /**
   * The width and height of the ad.
   */
  @Prop() size: string;

  /**
   * The slot targeting.
   */
  @Prop() targeting: string;

  /**
   * The sizeMap used for responsive behavior.
   */
  @Prop() sizeMap: string;

  parseOr = (x, y) => {
    try {
      return JSON.parse(x);
    } catch (err) {
      return y;
    }
  };

  refresh = () => {
    window.googletag.pubads().refresh([this.slot]);
  }

  setMQListeners = mapping => {
    mapping.forEach(([[width]]) => {
      if (width === 0) return;
      const mq = window.matchMedia(`(max-width: ${width}px)`)
      mq.addListener(this.refresh);
      this.mqListeners.push(() => mq.removeListener(this.refresh));
    });
  }

  componentWillLoad() {
    // Prevents HMR from running this script again
    if (this.slot) return;
    window.googletag.cmd.push(() => {
      const targeting = this.parseOr(this.targeting, {});
      const sizeMap = this.parseOr(this.sizeMap, []);
      const size = this.size.split('x').map(x => Number(x));

      // Define the first slot
      this.slot = window.googletag
        .defineSlot(this.adUnitPath, size, this.adId)
        .addService(window.googletag.pubads())

      // Set the targeting if there is one passed as props.
      if (targeting) this.slot.updateTargetingFromMap(targeting);

      // Set the sizeMap if it is defined.
      if (sizeMap.length) {
        const mapping = sizeMap.reduce((acc, [viewport, adSizes]) => {
          acc.addSize(viewport, adSizes);
          return acc;
        }, window.googletag.sizeMapping()).build();

        this.setMQListeners(mapping);
        this.slot.defineSizeMapping(mapping);
      }

      window.googletag.display(this.adId);
      window.googletag.pubads().refresh([this.slot]);
    })
  }

  disconnectedCallback() {
    this.mqListeners.forEach(fn => fn());
    window.googletag.destroySlots(this.slot);
  }

  render() {
    return (
      <Host id={this.adId}></Host>
    );
  }
}
