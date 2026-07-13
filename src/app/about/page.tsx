export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:py-14">
      <div className="rounded-3xl bg-white p-5 shadow-lg shadow-green-900/5 sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.25em] text-[#2f7d4b]">About</p>
        <h1 className="mt-2 text-3xl font-black text-[#183b25] sm:text-4xl">About Stiffler Homestead</h1>
        <p className="mt-5 leading-8 text-gray-700">
          We are a family homestead in Lexington, Kentucky, documenting the real work of building practical systems with chickens, sheep, compost, kids, and a lot of trial-and-error.
        </p>
        <p className="mt-4 leading-8 text-gray-700">
          This site turns our videos into written field notes, lessons learned, product updates, and the occasional “please do not repeat our mistake” warning.
        </p>
      </div>
    </div>
  );
}
