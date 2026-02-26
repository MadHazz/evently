export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Evently
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Staff and Organizer Portal
          </p>
        </div>
        {children}
      </div>
    </div>
  );
}
