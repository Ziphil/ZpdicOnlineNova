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
import {
  EnhancedDictionary
} from "/client/skeleton/dictionary";
import {
  data
} from "/client/util/data";


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
              <div styleName="title" {...data({small: dictionary !== undefined})}>
                <Link href="/" target="self" style="plane">ZpDIC</Link>
              </div>
              {(dictionary !== undefined) && (
                <div styleName="dictionary-name">
                  <Link href={"/dictionary/" + dictionary.number + ((preserveQuery) ? location.searchString : "")} target="self" style="plane">{dictionary.name}</Link>
                </div>
              )}
            </div>
            <div styleName="right">
              <div styleName="button-container">
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