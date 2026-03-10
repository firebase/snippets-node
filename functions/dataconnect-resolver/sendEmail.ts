// [START fdc_send_email_resolver]
import {
  FirebaseContext,
  GraphqlServerOptions,
  onGraphRequest,
} from "firebase-functions/dataconnect/graphql";

const opts: GraphqlServerOptions = {
  schemaFilePath: "dataconnect/schema_resolver/schema.gql",
  resolvers: {
    mutation: {
      sendEmail(
        _parent: unknown,
        args: Record<string, unknown>,
        _contextValue: FirebaseContext,
        _info: unknown
      ) {
        const { friendId, content } = args;

        // Look up the friend's email address and call the cloud service of your
        // choice to send the friend an email with the given content.

       return true;
      },
    },
  },
};

export const resolver = onGraphRequest(opts);
// [END fdc_send_email_resolver]
