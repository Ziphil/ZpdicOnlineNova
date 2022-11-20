//

import {
  ReactElement
} from "react";
import Button from "/client/component/atom/button";
import Link from "/client/component/atom/link";
import DictionaryHeader from "/client/component/compound/dictionary-header";
import {
  create
} from "/client/component/create";
import {
  useLocation,
  useMe,
  usePath,
  useTrans
} from "/client/component/hook";
import LogoSvg from "/client/public/logo.svg";
import SymbolSvg from "/client/public/symbol.svg";
import {
  EnhancedDictionary
} from "/client/skeleton/dictionary";


const Header = create(
  require("./header.scss"), "Header",
  function ({
    dictionary,
    showAddLink,
    showSettingLink,
    preserveQuery = false
  }: {
    dictionary?: EnhancedDictionary,
    showAddLink?: boolean,
    showSettingLink?: boolean,
    preserveQuery?: boolean
  }): ReactElement {

    const {trans} = useTrans("header");
    const {pushPath} = usePath();
    const location = useLocation();
    const [me] = useMe();

    const node = (
      <header styleName="root">
        <div styleName="content">
          <div styleName="top">
            <div styleName="left">
              {(dictionary === undefined) ? (
                <h1>
                  <Link styleName="link" href="/" target="self" style="plane">
                    <LogoSvg styleName="logo" alt="ZpDIC Online"/>
                  </Link>
                </h1>
              ) : (
                <h1 styleName="dictionary-name">
                  <Link styleName="link" href="/" target="self" style="plane">
                    <SymbolSvg styleName="symbol" alt=""/>
                  </Link>
                  <Link href={"/dictionary/" + dictionary.number + ((preserveQuery) ? location.searchString : "")} target="self" style="plane">
                    {dictionary.name}
                  </Link>
                </h1>
              )}
            </div>
            <div styleName="right">
              <div styleName="button-container">
                <Button label={trans("appearance")} iconName="brush" variant="simple" hideLabel={true} onClick={() => pushPath("/appearance")}/>
                <Button label={trans("dictionaryList")} iconName="book" variant="simple" hideLabel={true} onClick={() => pushPath("/list")}/>
              </div>
              {(me !== null) && (
                <>
                  <div styleName="separator"/>
                  <div styleName="home-container">
                    <Button iconName="house-user" variant="simple" onClick={() => pushPath("/dashboard")}/>
                  </div>
                </>
              )}
            </div>
          </div>
          {(dictionary !== undefined) && (
            <div styleName="addition">
              <DictionaryHeader dictionary={dictionary} showAddLink={showAddLink} showSettingLink={showSettingLink}/>
            </div>
          )}
        </div>
      </header>
    );
    return node;

  }
);


export default Header;