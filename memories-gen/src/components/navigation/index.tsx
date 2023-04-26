import { useNavigate } from "solid-start";

export default function Navigation() {
  const navigate = useNavigate();
  return (
    <div class="flex flex-row absolute bottom-16 left-0 w-screen gap-6 content-center justify-center">
      <div>
        <button class="outline outline-offset-2 outline-cyan-500" onClick={() => (navigate('/create'))}> Create </button>
      </div>
      <div>
        <button class="outline outline-offset-2 outline-yellow-500" onClick={() => (navigate('/archives'))}> Archives </button>
      </div>
      <div>
        <button class="outline outline-offset-2 outline-red-500" onClick={() => (navigate('/refresh'))}> Refresh Videos </button>
      </div>
    </div>
  );
}