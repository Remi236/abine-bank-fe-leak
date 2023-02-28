import { JellyTriangle } from '@uiball/loaders';
export function Loading() {
  return (
    <div className="d-flex justify-content-center">
      <JellyTriangle size={35} speed={1.75} color="#5e17eb" />
    </div>
  );
}
