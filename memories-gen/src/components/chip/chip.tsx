export default function(props: {text: string, className: string}) {
  return (
    <div
      class={`font-mono text-sm whitespace-nowrap flex justify-center items-center px-2 py-1 border border-gray-300 rounded-md font-medium dark:text-cyan-50	${props.className}`}>
        {props.text}
      </div>
  )
}