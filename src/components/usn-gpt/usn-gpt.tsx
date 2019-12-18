import { Component, h, State, Prop } from '@stencil/core';
declare const window: any;

@Component({
  tag: 'usn-gpt',
  styleUrl: 'usn-gpt.css',
  shadow: false,
})
export class GPT {
  /**
   * The GPT slot.
   */
  @State() loaded: boolean = false;

  /**
   * Centers all the ads.
   */
  @Prop() setCentering: boolean = false;

  /**
   * Enables SRA.
   */
  @Prop() enableSingleRequest: boolean = true;

  componentWillLoad() {
    if (this.loaded === true) return;

    window.googletag = window.googletag || { cmd: [] };
    window.googletag.cmd.push(() => {
      console.log(this.enableSingleRequest);
      console.log(this.setCentering);
      if (this.enableSingleRequest == true) window.googletag.pubads().enableSingleRequest();
      window.googletag.pubads().setCentering(this.setCentering);
      window.googletag.pubads().disableInitialLoad();
      window.googletag.enableServices();

      this.loaded = true;
    });
  }

  render() {
    return (
      <script async src="https://securepubads.g.doubleclick.net/tag/js/gpt.js"></script>
    );
  }
}
