import Link  from "next/link";
import { getDictionary } from "../../../get-dictionary";
import { Locale } from "../../../i18n-config";
import Counter from "../../../components/counter";
import LocaleSwitcher from "../../../components/locale-switcher";

export default async function IndexPage(props: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await props.params;
    console.log('🚀 ~ page.tsx ~ IndexPage ~ lang:', lang);
    const dictionary = await getDictionary(lang);
    console.log('🚀 ~ page.tsx ~ IndexPage ~ dictionary:', dictionary);


    return (
        <div>
            <LocaleSwitcher />
            <div>
                <p>Current locale3: { lang }</p>
                <p>
                    This text is rendered on the server:{ " " }
                    { dictionary["server-component"].welcome }
                </p>
                <Counter dictionary={ dictionary.counter } />
            </div>
            <div>
                <Link href={ `/${lang}` }>
                    home
                </Link>
            </div>
        </div>
    );
}
