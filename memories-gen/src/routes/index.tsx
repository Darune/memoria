import { A } from 'solid-start';
import tree from '~/assets/tree.svg';
import "./index.css";

export default function Home() {
  return (
    <main>
      <img src={tree}/>
      <div>
        <A href="/create"> Create </A>
      </div>
      <div>
        <A href="/archives"> Archives </A>
      </div>
      <div>
        <A href="/refresh"> refresh video </A>
      </div>
    </main>
  );
}
