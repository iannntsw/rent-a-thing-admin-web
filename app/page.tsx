// app/page.tsx
export default function Home() {
  return (
    <main className="p-10 text-center text-xl">
      <h1 className="font-bold text-2xl">Welcome to Rent A Thing</h1>
      <p className="mt-4 text-gray-600">
        Go to <a href="/(auth)/sign-up" className="text-blue-600 underline">Sign Up</a>
      </p>
    </main>
  );
}
