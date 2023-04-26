import { A } from 'solid-start';
import Tree from '~/assets/tree.svg?component-solid';
import Navigation from '~/components/navigation';
import "./index.css";

export default function Home() {
  return (
    <main class="relative">
      {/* <img src={tree}/> */}
      <div class="w-screen flex justify-center">
        <Tree class="max-h-screen"/>
      </div>
      <Navigation />
    </main>
  );
}
