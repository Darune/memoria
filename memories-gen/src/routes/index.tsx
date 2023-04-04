import { A } from 'solid-start';
import "./index.css";

export default function Home() {
  return (
    <main>
      <div>
        <A href="/create"> Create </A>
      </div>
      <div>
        <A href="/refresh"> refresh video </A>
      </div>
      to learn how to build Solid apps.
    </main>
  );
}
