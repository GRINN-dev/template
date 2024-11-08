import { render } from "@react-email/components";

import MyEmail from "../../../../tooling/transactional/emails/my-email";

export default function Page(): JSX.Element {
  const emailHTML = render(MyEmail());

  return <div dangerouslySetInnerHTML={{ __html: emailHTML }} />;
}
