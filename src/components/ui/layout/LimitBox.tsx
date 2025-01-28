export default function ContextBox({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`max-w-[1000px] w-full px-4 py-6 bg-gray-100 border border-gray-300 rounded-lg shadow-md mx-auto`}
    >
      {children}
    </div>
  );
}
