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
  @State() slot: object;

  /**
   * The first name
   */
  @Prop() id: string;

  /**
 * The first name
 */
  @Prop() adUnitPath: string;

  /**
   * The with and height of the ad.
   */
  @Prop() size: string;

  componentWillLoad() {
    // Prevents HMR from running this script again
    if (this.slot) return;
    window.googletag.cmd.push(() => {
      // Define the first slot
      this.slot = window.googletag
        .defineSlot(this.adUnitPath, [728, 90], this.id)
        .setTargeting("test", "infinitescroll")
        .addService(window.googletag.pubads());

      window.googletag.display(this.id);
      window.googletag.pubads().refresh([this.slot]);
    })
  }

  disconnectedCallback() {
    window.googletag.destroySlots(this.slot);
  }

  render() {
    return (
      <Host id={this.id}></Host>
    );
  }
}
