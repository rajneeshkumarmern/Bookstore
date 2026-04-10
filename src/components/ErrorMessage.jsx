export default function ErrorMessage({ message }) {
  return (
    <div className="text-red-500 text-center py-5">
      {message}
    </div>
  );
}