import styles from "./page.module.css";
import { sampleMulticastEnvelope, sampleNostrUnicast, sampleSystemDirective, sampleUnicastEnvelope } from "@/lib/tmp/sample";

export default function Home() {
  const unicast = sampleUnicastEnvelope();
  const multicast = sampleMulticastEnvelope();
  const directive = sampleSystemDirective();
  const wrapped = sampleNostrUnicast();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.header}>
          <p className={styles.badge}>TMP v3 Protocol + POC</p>
          <h1>Tendon Message Protocol workspace</h1>
          <p>
            Local-first protocol scaffolding is active. This app now hosts typed envelope models, a transport wrapper,
            and an API endpoint at <code>/api/protocol/envelope</code> for round-trip testing.
          </p>
        </div>

        <div className={styles.grid}>
          <section className={styles.card}>
            <h2>Unicast Envelope</h2>
            <pre>{JSON.stringify(unicast, null, 2)}</pre>
          </section>
          <section className={styles.card}>
            <h2>Multicast Envelope</h2>
            <pre>{JSON.stringify(multicast, null, 2)}</pre>
          </section>
          <section className={styles.card}>
            <h2>System Directive</h2>
            <pre>{JSON.stringify(directive, null, 2)}</pre>
          </section>
          <section className={styles.card}>
            <h2>Nostr Wrapped Event</h2>
            <pre>{JSON.stringify(wrapped, null, 2)}</pre>
          </section>
        </div>
      </main>
    </div>
  );
}
