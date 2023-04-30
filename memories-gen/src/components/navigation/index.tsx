import { useNavigate } from "solid-start";

export default function Navigation() {
  const navigate = useNavigate();
  return (
    <div class="flex flex-row gap-6 content-center justify-center h-68">
      <div>
        <button class="outline outline-offset-2 outline-cyan-500 dark:text-slate-200" onClick={() => (navigate('/create'))}> Create </button>
      </div>
      <div>
        <button class="outline outline-offset-2 outline-yellow-500 dark:text-slate-200" onClick={() => (navigate('/archives'))}> Archives </button>
      </div>
    </div>
  );
}