// import fetchMock from "fetch-mock";
// import * as api from "../api";
// import * as help from "../../helpers";
// import * as pki from "../pki.js";
// import {
//   assertGETOnRouteIsCalled,
//   assertRouteIsCalledWithQueryParams,
//   assertPOSTOnRouteIsCalled,
//   makeApiResponse
// } from "./support/helpers";
// import { PROPOSAL_TYPE_REGULAR, PROPOSAL_STATE_VETTED } from "../../constants";

// describe("api integration modules (lib/api.js)", () => {
//   const MOCKS_PATH = "../../../mocks/api/";
//   const FAKE_CSRF = "itsafake";
//   const EMAIL = "foo@bar.com";
//   const USERNAME = "foo";
//   const USERID = "2";
//   const PASSWORD = "foobarpassword";
//   const VERIFICATION_TOKEN = "thisIsAVerificationToken";
//   const PROPOSAL_NAME = "Test prop";
//   const PROPOSAL_TYPE = PROPOSAL_TYPE_REGULAR;
//   const PROPOSAL_TOKEN = "FAKE_TOKEN";
//   const PROPOSAL_VERSION = "2";
//   const RFP_DEADLINE = undefined;
//   const RFP_LINK = undefined;
//   const MARKDOWN = "# This is a test proposal";
//   const FILE = {
//     name: "example.jpeg",
//     mime: "image/jpeg",
//     payload: "VGVzdCBwcm9wCiMgVGhpcyBpcyBhIHRlc3QgcHJvcG9zYWw="
//   };
//   const FILE_DIGESTED_PAYLOAD =
//     "3973715772c4e0d41fc98fb67e97ad2436dca47961ac78a0757be43053d5af8c";
//   const COMMENT_TOKEN =
//     "6284c5f8fba5665373b8e6651ebc8747b289fed242d2f880f64a284496bb4ca8";
//   const COMMENT = "I dont like this prop";

//   beforeAll(async () => {
//     try {
//       const keys = await pki.generateKeys();
//       await pki.loadKeys(USERID, keys);
//     } catch (e) {
//       console.log(e);
//     }
//   });

//   test("converts a markdown to a file", () => {
//     const file = api.convertMarkdownToFile(MARKDOWN);
//     expect(file).toEqual({
//       name: "index.md",
//       mime: "text/plain; charset=utf-8",
//       payload: "IyBUaGlzIGlzIGEgdGVzdCBwcm9wb3NhbA=="
//     });
//   });

//   // test("make a proposal", () => {
//   //   let proposal = api.makeProposal(
//   //     PROPOSAL_NAME,
//   //     MARKDOWN,
//   //     RFP_DEADLINE,
//   //     PROPOSAL_TYPE,
//   //     RFP_LINK,
//   //     [FILE]
//   //   );
//   //   const fileFromMarkdown = api.convertMarkdownToFile(
//   //     PROPOSAL_NAME + "\n\n" + MARKDOWN
//   //   );
//   // expect(proposal).toEqual({
//   //   files: [
//   //     {
//   //       payload: help.bufferToBase64String(
//   //         help.objectToBuffer({
//   //           name: PROPOSAL_NAME
//   //         })
//   //       ),
//   //       digest: help.objectToSHA256({
//   //         name: PROPOSAL_NAME
//   //       })
//   //     },
//   //     {
//   //       ...fileFromMarkdown,
//   //       digest: help.digestPayload(fileFromMarkdown.payload)
//   //     },
//   //     {
//   //       ...FILE,
//   //       digest: FILE_DIGESTED_PAYLOAD
//   //     }
//   //   ]
//   // });
//   // test without providing attachment object
//   // proposal = api.makeProposal(
//   //   PROPOSAL_NAME,
//   //   MARKDOWN,
//   //   RFP_DEADLINE,
//   //   PROPOSAL_TYPE,
//   //   RFP_LINK
//   // );
//   // expect(proposal).toEqual({
//   //   files: [
//   //     {
//   //       ...fileFromMarkdown,
//   //       digest: help.digestPayload(fileFromMarkdown.payload)
//   //     }
//   //   ],
//   //   metadata: [
//   //     {
//   //       hint: "proposalmetadata",
//   //       payload: help.bufferToBase64String(
//   //         help.objectToBuffer({
//   //           name: PROPOSAL_NAME
//   //         })
//   //       ),
//   //       digest: help.objectToSHA256({
//   //         name: PROPOSAL_NAME
//   //       })
//   //     }
//   //   ]
//   // });

//   // test with a falsy attachment
//   // proposal = api.makeProposal(
//   //   PROPOSAL_NAME,
//   //   MARKDOWN,
//   //   RFP_DEADLINE,
//   //   PROPOSAL_TYPE,
//   //   RFP_LINK,
//   //   false
//   // );
//   //   expect(proposal).toEqual({
//   //     files: [
//   //       {
//   //         ...fileFromMarkdown,
//   //         digest: help.digestPayload(fileFromMarkdown.payload)
//   //       }
//   //     ],
//   //     metadata: [
//   //       {
//   //         hint: "proposalmetadata",
//   //         payload: help.bufferToBase64String(
//   //           help.objectToBuffer({
//   //             name: PROPOSAL_NAME
//   //           })
//   //         ),
//   //         digest: help.objectToSHA256({
//   //           name: PROPOSAL_NAME
//   //         })
//   //       }
//   //     ]
//   //   });
//   // });

//   test("make a comment", () => {
//     expect.assertions(2);
//     const PARENT_ID = 12;
//     // make a comment with a parent Id
//     let comment = api.makeComment(COMMENT_TOKEN, COMMENT, PARENT_ID);
//     expect(comment).toEqual({
//       token: COMMENT_TOKEN,
//       comment: COMMENT,
//       parentid: PARENT_ID
//     });
//     // make a comment without a parent Id
//     comment = api.makeComment(COMMENT_TOKEN, COMMENT);
//     expect(comment).toEqual({
//       token: COMMENT_TOKEN,
//       comment: COMMENT,
//       parentid: 0
//     });
//   });

//   // test("like a comment", () => {
//   //   expect.assertions(1);
//   //   const COMMENT_ID = 3;
//   //   // make a comment with a parent Id
//   //   const comment = api.makeCommentVote(
//   //     COMMENT_TOKEN,
//   //     1,
//   //     COMMENT_ID,
//   //     PROPOSAL_STATE_VETTED
//   //   );
//   //   expect(comment).toEqual({
//   //     token: COMMENT_TOKEN,
//   //     vote: 1,
//   //     commentid: COMMENT_ID
//   //   });
//   // });

//   // test("signs a proposal", async () => {
//   //   expect.assertions(3);
//   //   try {
//   //     const proposal = api.makeProposal(PROPOSAL_NAME, MARKDOWN, [FILE]);
//   //     const pubKey = await pki.myPubKeyHex(USERID);
//   //     const signedProposal = await api.signRegister(USERID, proposal);
//   //     expect(signedProposal.publickey).toEqual(pubKey);
//   //     expect(signedProposal.files).toEqual(proposal.files);
//   //     expect(signedProposal.signature).toBeTruthy();
//   //   } catch (e) {
//   //     console.log(e);
//   //   }
//   // });

//   // test("signs a comment", async () => {
//   //   expect.assertions(3);
//   //   try {
//   //     const comment = api.makeComment(COMMENT_TOKEN, COMMENT);
//   //     const pubKey = await pki.myPubKeyHex(USERID);
//   //     const signedComment = await api.signComment(USERID, comment);
//   //     expect(signedComment.publickey).toEqual(pubKey);
//   //     expect(signedComment.token).toEqual(comment.token);
//   //     expect(signedComment.signature).toBeTruthy();
//   //   } catch (e) {
//   //     throw e;
//   //   }
//   // });

//   // test("parses a response", async () => {
//   //   // expect.assertions(4);
//   //   const correctHeaders = new Headers({
//   //     "content-type": "application/json; charset=utf-8",
//   //     "X-Csrf-Token":
//   //       "6284c5f8fba5665373b8e6651ebc8747b289fed242d2f880f64a284496bb4ca9"
//   //   });
//   //   const correctBody = { foo: "bar" };
//   //   let initResponse = {
//   //     status: "200",
//   //     headers: correctHeaders
//   //   };
//   //   let response = makeApiResponse(initResponse, correctBody);
//   //   response.url = "/api/record/v1/";

//   //   let parsedResponse = await api.parseResponse(response);
//   //   expect(parsedResponse).toEqual({
//   //     response: { foo: "bar" },
//   //     csrfToken:
//   //       "6284c5f8fba5665373b8e6651ebc8747b289fed242d2f880f64a284496bb4ca9"
//   //   });
//   //   response = makeApiResponse(initResponse, { errorcode: 1 });
//   //   response.url = "/api/record/v1/";

//   //   try {
//   //     parsedResponse = await api.parseResponse(response);
//   //   } catch (e) {
//   //     expect(e).toEqual(new Error(help.getHumanReadableError(1)));
//   //   }

//   //   // test with an unexpected headers object
//   //   const invalidHeaders = new Headers({});
//   //   initResponse = {
//   //     status: "200",
//   //     headers: invalidHeaders
//   //   };
//   //   response = makeApiResponse(initResponse, correctBody);
//   //   response.url = "/api/record/v1/";

//   //   try {
//   //     parsedResponse = await api.parseResponse(response);
//   //   } catch (e) {
//   //     expect(e).toEqual(new Error("Internal server error"));
//   //   }

//   //   // test with error-status responses
//   //   // 400 - Bad Request
//   //   initResponse = {
//   //     status: "400",
//   //     headers: correctHeaders
//   //   };
//   //   response = makeApiResponse(initResponse, correctBody);
//   //   response.url = "/api/record/v1/";

//   //   try {
//   //     parsedResponse = await api.parseResponse(response);
//   //   } catch (e) {
//   //     expect(e).toEqual(new Error("Bad response from server"));
//   //   }
//   // });

//   // test("fetches api info ", async () => {
//   //   expect.assertions(3);
//   //   const PATH = "/api/";
//   //   const MOCK_RESULT = await import(`${MOCKS_PATH}/GET.json`).then(
//   //     (d) => d.default
//   //   );

//   //   // set csrf token header
//   //   fetchMock.getOnce(PATH, {
//   //     body: MOCK_RESULT,
//   //     headers: { "X-Csrf-Token": "notafake" }
//   //   });
//   //   let result = await api.apiInfo();
//   //   expect(fetchMock.called(PATH)).toBeTruthy();
//   //   expect(result).toEqual({ ...MOCK_RESULT, csrfToken: "notafake" });

//   //   // do not set csrf token header
//   //   fetchMock.restore();
//   //   fetchMock.getOnce(PATH, { body: MOCK_RESULT, headers: {} });
//   //   result = await api.apiInfo();
//   //   expect(result).toEqual({ ...MOCK_RESULT, csrfToken: null });
//   // });

//   // test("fetches current info user (api/user/me) - CSRF token disabled", async () => {
//   //   expect.assertions(2);
//   //   const PATH = "/api/v1/user/me";
//   //   const MOCK_RESULT = await import(`${MOCKS_PATH}/v1/user/me/GET.json`);
//   //   const result = await assertGETOnRouteIsCalled(
//   //     PATH,
//   //     api.me,
//   //     [],
//   //     MOCK_RESULT
//   //   );
//   //   const publickey = MOCK_RESULT.publickey;
//   //   delete MOCK_RESULT.publickey;
//   //   delete MOCK_RESULT.csrfToken;
//   //   expect(result).toEqual({
//   //     ...MOCK_RESULT,
//   //     publickey
//   //   });
//   // });

//   // test("create new user (api/user/new)", async () => {
//   //   await assertPOSTOnRouteIsCalled("/api/v1/user/new", api.newUser, [
//   //     FAKE_CSRF,
//   //     EMAIL,
//   //     USERNAME,
//   //     PASSWORD
//   //   ]);
//   // });

//   // test("verify new user (api/v1/user/verify)", async () => {
//   //   const PATH = "/api/v1/user/verify";
//   //   await assertRouteIsCalledWithQueryParams(
//   //     PATH,
//   //     {
//   //       email: EMAIL,
//   //       verificationToken: VERIFICATION_TOKEN
//   //     },
//   //     api.verifyNewUser,
//   //     [EMAIL, VERIFICATION_TOKEN, USERNAME]
//   //   );
//   // });

//   // test("verify user payment (api/v1/user/payments/registration)", async () => {
//   //   const PATH = "/api/v1/user/payments/registration";
//   //   const MOCK_RESULT = await import(
//   //     `${MOCKS_PATH}/v1/user/payments/registration/GET.json`
//   //   );
//   //   await assertGETOnRouteIsCalled(
//   //     PATH,
//   //     api.verifyUserPayment,
//   //     [],
//   //     MOCK_RESULT
//   //   );
//   // });

//   // test("fetch user proposals (api/v1/user/proposals)", async () => {
//   //   expect.assertions(1);
//   //   const PATH = "begin:/api/v1/user/proposals";
//   //   const USER_ID = 1;
//   //   await assertRouteIsCalledWithQueryParams(
//   //     PATH,
//   //     {
//   //       userid: USER_ID.toString()
//   //     },
//   //     api.userProposals,
//   //     [USER_ID]
//   //   );
//   // });

//   // test("login (api/v1/login)", async () => {
//   //   await assertPOSTOnRouteIsCalled("/api/v1/login", api.login, [
//   //     FAKE_CSRF,
//   //     EMAIL,
//   //     PASSWORD
//   //   ]);
//   // });

//   // test("change user name (api/v1/user/username/change)", async () => {
//   //   await assertPOSTOnRouteIsCalled(
//   //     "/api/v1/user/username/change",
//   //     api.changeUsername,
//   //     [FAKE_CSRF, PASSWORD, USERNAME]
//   //   );
//   // });

//   // test("change password (api/v1/user/password/change)", async () => {
//   //   await assertPOSTOnRouteIsCalled(
//   //     "/api/v1/user/password/change",
//   //     api.changePassword,
//   //     [FAKE_CSRF, PASSWORD, "some_new_password"]
//   //   );
//   // });

//   // test("resend verification email (api/v1/user/new/resend)", async () => {
//   //   await assertPOSTOnRouteIsCalled(
//   //     "/api/v1/user/new/resend",
//   //     api.resendVerificationEmailRequest,
//   //     [FAKE_CSRF, EMAIL]
//   //   );
//   // });

//   // test("verify resend verification email (api/v1/user/new/resend)", async () => {
//   //   fetchMock.restore();
//   //   await assertPOSTOnRouteIsCalled(
//   //     "/api/v1/user/new/resend",
//   //     api.resendVerificationEmailRequest,
//   //     [FAKE_CSRF, EMAIL, VERIFICATION_TOKEN]
//   //   );
//   // });

//   // test("update key (api/v1/user/key", async () => {
//   //   await assertPOSTOnRouteIsCalled("/api/v1/user/key", api.updateKeyRequest, [
//   //     FAKE_CSRF,
//   //     EMAIL
//   //   ]);
//   // });

//   // test("verify key (api/v1/user/key/verify)", async () => {
//   //   await assertPOSTOnRouteIsCalled(
//   //     "/api/v1/user/key/verify",
//   //     api.verifyKeyRequest,
//   //     [FAKE_CSRF, USERID, VERIFICATION_TOKEN]
//   //   );
//   // });

//   // test("get policy (api/v1/policy)", async () => {
//   //   await assertGETOnRouteIsCalled("/api/v1/policy", api.policy, []);
//   // });

//   // test("get comments votes (api/v1/comments/votes)", async () => {
//   //   await assertPOSTOnRouteIsCalled(
//   //     "express:/api/v1/comments/votes",
//   //     api.likedComments,
//   //     [PROPOSAL_TOKEN]
//   //   );
//   // });

//   // test("get proposal comments (api/v1/comments)", async () => {
//   //   await assertPOSTOnRouteIsCalled(
//   //     "express:/api/v1/comments",
//   //     api.proposalComments,
//   //     [PROPOSAL_TOKEN]
//   //   );
//   // });

//   // test("logout (api/v1/logout)", async () => {
//   //   //make sure local storage is being cleaned up on logout
//   //   localStorage.setItem("state", "anything");
//   //   await assertPOSTOnRouteIsCalled("/api/v1/logout", api.logout, [FAKE_CSRF]);
//   //   expect(localStorage.getItem("state")).toBeFalsy();
//   // });

//   // test("set proposal status (api/v1/proposal/setstatus)", async () => {
//   //   await assertPOSTOnRouteIsCalled(
//   //     "express:/api/v1/proposal/setstatus",
//   //     api.proposalSetStatus,
//   //     [USERID, FAKE_CSRF, PROPOSAL_TOKEN, 2]
//   //   );
//   // });

//   // test("create a new comment (api/v1/comment/new", async () => {
//   //   await assertPOSTOnRouteIsCalled("/api/v1/comment/new", api.newComment, [
//   //     FAKE_CSRF,
//   //     COMMENT
//   //   ]);
//   // });

//   // test("create new proposal (api/v1/proposal/new)", async () => {
//   //   const proposal = api.makeProposal(PROPOSAL_NAME, MARKDOWN, [FILE]);
//   //   await assertPOSTOnRouteIsCalled("/api/v1/proposal/new", api.newProposal, [
//   //     FAKE_CSRF,
//   //     proposal
//   //   ]);
//   // });

//   // test("start vote (api/v1/vote/start)", async () => {
//   //   await assertPOSTOnRouteIsCalled("/api/v1/vote/start", api.startVote, [
//   //     FAKE_CSRF,
//   //     USERID,
//   //     [{ token: PROPOSAL_TOKEN, duration: 2 }]
//   //   ]);
//   // });

//   // test("fetch proposal paywall details (api/v1/user/payments/paywall)", async () => {
//   //   await assertGETOnRouteIsCalled(
//   //     "/api/v1/user/payments/paywall",
//   //     api.proposalPaywallDetails,
//   //     []
//   //   );
//   // });

//   // test("fetch user proposal credits (api/v1/user/payments/credits)", async () => {
//   //   await assertGETOnRouteIsCalled(
//   //     "/api/v1/user/payments/credits",
//   //     api.userProposalCredits,
//   //     []
//   //   );
//   // });

//   // test("get user details (api/v1/user/:userId)", async () => {
//   //   const USER_ID = 0;
//   //   await assertGETOnRouteIsCalled("express:/api/v1/user/:userId", api.user, [
//   //     USER_ID.toString()
//   //   ]);
//   // });

//   // test("edit user (api/user/manage)", async () => {
//   //   const USER_ID = 0;
//   //   const ACTION = "FAKE_ACTION";
//   //   const REASON = "FAKE_REASON";
//   //   await assertPOSTOnRouteIsCalled("/api/v1/user/manage", api.manageUser, [
//   //     FAKE_CSRF,
//   //     USER_ID,
//   //     ACTION,
//   //     REASON
//   //   ]);
//   // });

//   // test("edit a proposal (api/v1/proposal/edit)", async () => {
//   //   const proposal = api.makeProposal(PROPOSAL_NAME, MARKDOWN, [FILE]);
//   //   await assertPOSTOnRouteIsCalled(
//   //     "/api/v1/proposal/edit",
//   //     api.editProposal,
//   //     [FAKE_CSRF, proposal],
//   //     {
//   //       proposal
//   //     }
//   //   );
//   // });

//   // test("authorize vote to start (api/v1/vote/authorize)", async () => {
//   //   await assertPOSTOnRouteIsCalled(
//   //     "/api/v1/vote/authorize",
//   //     api.proposalAuthorizeOrRevokeVote,
//   //     [FAKE_CSRF, "authorize", PROPOSAL_TOKEN, USERID, PROPOSAL_VERSION]
//   //   );
//   // });
// });
