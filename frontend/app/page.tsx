import { Appbar } from "@/components/Appbar";
import { Hero } from "@/components/Hero";
import Image from "next/image";

export default function Home() {
  return (
    <main className="">
       <Appbar/>
       <Hero></Hero>
       {/* <HeroVideo></HeroVideo> */}

    </main>
  );
}
