import Link from "next/link";
import { getDictionary } from "../../get-dictionary";
import { Locale } from "../../i18n-config";
import Counter from "../../components/counter";
import LocaleSwitcher from "../../components/locale-switcher";
import NavMenu from "../../components/menuNav/NavMenu";
import CarouselMain from "@/components/Home/CarouselMain";


export default async function IndexPage(props: { params: Promise<{ lang: Locale }> }) {
  const { lang } = await props.params;

  const dictionary = await getDictionary(lang);



  return (
    <div className="relative">
      <CarouselMain />
      <LocaleSwitcher />
      <div>
        <p>Current locale2: { lang }</p>
        <p>
          This text is rendered on the server:{ " " }
          { dictionary["server-component"].welcome }
        </p>
        <Counter dictionary={ dictionary.counter } />
      </div>
      <div>
        <Link href={ `${lang}/dashboard` }>
          dashboard
        </Link>
      </div>
      <img src="favicon.ico" alt="logo"/>
      {/* <NavMenu />  */}
    </div>
  );
}
