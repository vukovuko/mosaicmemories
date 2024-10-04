import Image from "next/image";
import Link from "next/link";
import flamingo from "../../public/flamingo_mosaic1.jpg";

export default function Home() {
  return (
    <section>
      <div className="flex flex-col md:flex-row">
        <div className="flex-shrink-0">
          <Image src={flamingo} alt="flamingo" />
        </div>

        <div className="flex items-start justify-start p-4">
          <div>
            <h1 className="text-4xl font-bold mb-4">
              Pregledajte Svoju Mozaičku Sliku
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Postavite svoju sliku da biste videli kako bi izgledala u prelepom
              mozaiku od piksela. Možete prilagoditi stil i direktno kupiti
              finalnu umetničku sliku sa našeg sajta!
            </p>
            <Link href="/fileupload" passHref>
              <button className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700">
                Postavite Sliku
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
