import React from 'react'

const About = () => (
  <section className="has-margin-top">
    <div className="container">
      <div className="content">
        <h1 className="is-title">Cypheglass Glass Version 1.0</h1>
        <p>
          Glass is an open source tool that enables all EOS Block Producers to
          publicly disclose and manage their ownership interests and infrastructure
          via a dApp on the EOS blockchain. At Cypherglass we are all about transparency
          on the EOS network, and our goal is to ensure the EOS network stays free from
          corruption and centralization.
        </p>
        <p>
          Currently we are in phase one of Glass.  This phase is designed to enable the
          EOS community to obtain a transparent, graphical view of block producer
          information, and for block producers to verify the information they provide the
          EOS community in their bp.json file as linked in the blockchain data.  The bp.json
          file is essentially an info/configuration file that is provided by each block
          producer.  As you view block producers using Glass, if information is missing, it’s
          because the block producer has incorrect or missing information in their bp.json file.
          You can click on the details of a specific block producer within Glass and see their
          actual bp.json like this one:{' '}
          <a href="https://www.cypherglass.com/bp.json" target="_blank">https://www.cypherglass.com/bp.json</a>
        </p>
        <p>
          Phase two will be released in August, and will enable EOS block producers to provide
          voluntary information about their business. Some of these fields include ownership
          structure, infrastructure, and additional additional node information.  You can view
          more information about the phases of Glass here:{' '}
          <a href="https://steemit.com/eos/@cypherglass/update-glass-a-tool-to-protect-the-eos-network-from-corruption-and-collusion" target="_blank">
          https://steemit.com/eos/@cypherglass/update-glass-a-tool-to-protect-the-eos-network-from-corruption-and-collusion</a>
          .
        </p>
        <p>
          The Glass code is on our GitHub repository here:{' '}
          <a href="https://github.com/cypherglassdotcom/glass" target="_blank">https://github.com/cypherglassdotcom/glass</a>.
          Please feel free to leave upgrade suggestions, log bugs, or use the code yourself. You can also find
          us on Telegram here <a href="https://t.me/cypherglass" target="_blank">https://t.me/cypherglass</a> or visit our
          website at <a href="https://www.cypherglass.com" target="_blank">https://www.cypherglass.com</a>.
        </p>
      </div>
    </div>
  </section>
)

export default About
