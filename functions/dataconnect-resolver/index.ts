// [START fdc_resolver_skeleton]
import {
  FirebaseContext,
  GraphqlServerOptions,
  onGraphRequest,
} from "firebase-functions/dataconnect/graphql";

const opts: GraphqlServerOptions = {
  // Points to the schema you defined earlier, relative to the root of your
  // Firebase project.
  schemaFilePath: "dataconnect/schema_resolver/schema.gql",
  resolvers: {
    query: {
      // This resolver function populates the data for the "publicProfile" field
      // defined in your GraphQL schema located at schemaFilePath.
      publicProfile(
        _parent: unknown,
        args: Record<string, unknown>,
        _contextValue: FirebaseContext,
        _info: unknown
      ) {
        const userId = args.userId;

        // Here you would use the user ID to retrieve the user profile from your data
        // store. In this example, we just return a hard-coded value.

        return {
          name: "Ulysses von Userberg",
          photoUrl: "https://example.com/profiles/12345/photo.jpg",
          bioLine: "Just a guy on a mountain. Ski fanatic.",
        };
      },
    },
    mutation: {
      // This resolver function updates data for the "updatePublicProfile" field
      // defined in your GraphQL schema located at schemaFilePath.
      updatePublicProfile(
        _parent: unknown,
        args: Record<string, unknown>,
        _contextValue: FirebaseContext,
        _info: unknown
      ) {
        const { userId, name, photoUrl, bioLine } = args;

        // Here you would update in your datastore the user's profile using the
        // arguments that were passed. In this example, we just return the profile
        // as though the operation had been successful.

        return { name, photoUrl, bioLine };
      },
    },
  },
};

export const resolver = onGraphRequest(opts);
// [END fdc_resolver_skeleton]
