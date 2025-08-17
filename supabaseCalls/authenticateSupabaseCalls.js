import { supabase } from "../supabase";
// import { makeRedirectUri } from "expo-auth-session";

export const sessionCheck = async() => {
  const session = await supabase.auth.getSession();
  return session;
};

export const sessionRefresh = async(refresh_token) => {
  const { data, error } = await supabase.auth.refreshSession({ refresh_token });

  if (error) {
    console.log("couldn't refresh session,", error);
    return null;
  }

  if (data) {
    // console.log(data);
    return data;
  }
};

export const userCheck = async() => {
  const user = await supabase.auth.user();
  return user;
};

export const register = async(registerDetails) => {
  const { data, error } = await supabase.auth.signUp(
    {
      email: registerDetails.email,
      password: registerDetails.password,
      options:  {
        data: {
          fullName: registerDetails.name,
        },
      },
    },
  );

  if (error) {
    console.log("couldn't register,", error);
  }

  if (data) {
    return { data };
  }
};

export const signInStandard = async(email, password) => {
  console.log({ email, password });
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.log("couldn't login,", error);
  }

  if (data) {
    return { data };
  }
};

// export const signInFaceBook = async () => {
//   const redirectTo = makeRedirectUri();

//   console.log("hey", redirectTo)
//   if(redirectTo){
//     const { data, error } = await supabase.auth.signInWithOAuth({
//       provider: 'facebook',
//       options :{
//         redirectTo,
//         skipBrowserRedirect: true,
//       }
//     });

//     if (error) {
//       console.log("couldn't login,", error);
//     }

//     if (user && session) {
//       // console.log(user, session);
//       return { user, session };
//     }
//   }

// };

export const signInGoogle = async() => {
  const { user, session, error } = await supabase.auth.signIn({
    provider: "google"
  });

  console.log(user, session, error);
  if (error) {
    console.log("couldn't login,", error);
  }

  if (user && session) {
    // console.log(user, session);
    return { user, session };
  }
};

export const signOut = async() => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log("couldn't logout,", error);
  }
};

export const userDelete = async(userIdValue) => {

  const { data, error } = await supabase.rpc("delete_user", { "userid": userIdValue });

  if (error) {
    console.log("couldn't delete user,", error);
    return [];
  }

  if (data) {
    console.log("user was deleted");
  }
};
