export function Error({message}: {message? : string | null | undefined}) {
  return <div className='text-center text-danger'>Error: {message}</div>;
}
