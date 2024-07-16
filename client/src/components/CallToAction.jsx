import { Button } from "flowbite-react";
export default function CallToAction() {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl">
      {/* Left  */}
      <div className="flex-1 justify-center flex flex-col gap-4">
        <h2 className="text-2xl">Want to learn more about Javascript?</h2>
        <p className="text-gray-500">
          Checkout these resources with 100 Javascript Projects
        </p>
        <Button
          gradientDuoTone="purpleToPink"
          className="rounded-tl-xl rounded-bl-none"
        >
          <a
            href="https://blog.100jsprojects.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            100 Javascripts Projects
          </a>
        </Button>
      </div>
      {/* Right */}
      <div className="p-7 flex-1">
        <img src="https://media.geeksforgeeks.org/wp-content/cdn-uploads/20221114110410/Top-10-JavaScript-Project-Ideas-For-Beginners-2023.png" />
      </div>
    </div>
  );
}
