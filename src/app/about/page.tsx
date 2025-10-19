export default function About() {
  return (
    <main className="p-4 max-w-4xl mx-auto text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-4">About</h1>
      <p className="mb-2">Name: Tan Dung Nguyen</p>
      <p className="mb-4">Student Number: 22162861</p>
      <h2 className="text-xl mb-2">How to Use This Website</h2>
      <video controls width="1300" className="mb-4" aria-label="Instructional video">
        <source src="/walkthrough.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </main>
  );
}