import Head from "next/head";
import styles from "../styles/Home.module.css";
import SpotifyInput from "../components/SpotifyInput";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";


export default function Home({ repositories }) {
  return (
    <div className="bg-black">
      <Navbar/>
      <SpotifyInput/>
      <Footer/>
    </div>
  );
}

