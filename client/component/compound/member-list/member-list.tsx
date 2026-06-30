//

import {ReactElement} from "react";
import {AdditionalProps, Card, CardBody, CardFooter, List, ListBody, ListEmptyView, ListLoadingView, ListPagination, PageSpec, SingleLineText, useTrans} from "zographia";
import {Link} from "/client/component/atom/link";
import {UserAvatar} from "/client/component/atom/user-avatar";
import {create} from "/client/component/create";
import {DictionaryWithExecutors, Member} from "/server/internal/skeleton";
import {MemberFooter} from "./member-footer";


export const MemberList = create(
  require("./member-list.scss"), "MemberList",
  function ({
    dictionary,
    members,
    pageSpec,
    ...rest
  }: {
    dictionary: DictionaryWithExecutors,
    members: Array<Member> | undefined,
    pageSpec: PageSpec,
    className?: string
  } & AdditionalProps): ReactElement {

    const {trans} = useTrans("memberList");

    return (
      <List styleName="root" items={members} pageSpec={pageSpec} {...rest}>
        <ListBody styleName="body">
          {(member) => (
            <Card key={member.id}>
              <CardBody>
                <div styleName="top">
                  <UserAvatar styleName="avatar" user={member.user}/>
                  <div styleName="name-container">
                    <Link styleName="screen-name" href={`/user/${member.user.name}`} variant="unstyledSimple">
                      <SingleLineText>
                        {member.user.screenName}
                      </SingleLineText>
                    </Link>
                    <SingleLineText styleName="name">
                      @{member.user.name}
                    </SingleLineText>
                  </div>
                </div>
              </CardBody>
              <CardFooter styleName="footer">
                <MemberFooter dictionary={dictionary} user={member.user}/>
              </CardFooter>
            </Card>
          )}
          <ListLoadingView styleName="loading"/>
          <ListEmptyView styleName="loading">
            {trans("empty")}
          </ListEmptyView>
        </ListBody>
        <ListPagination styleName="pagination"/>
      </List>
    );

  }
);
