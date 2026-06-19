import Image from "next/image";
import Banner from "../components/Banner";
import TopSellingArtists from "@/components/TopSellingArtis";
import ArtCategories from "@/components/ArtCategory";
import FeaturedArtworks from "@/components/FeaturedArtWork";

export default function Home() {
  return (
    <>
      <Banner />
      <ArtCategories/>
      <FeaturedArtworks/>
      <TopSellingArtists />
    </>
  );
}
