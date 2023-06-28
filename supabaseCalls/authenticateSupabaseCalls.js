import { supabase } from "../supabase";


export const sessionCheck = async() => {
  const session = await supabase.auth.session();
  return session
};

export const sessionRefresh = async(refresh_token) => {
  const { data, error } = await supabase.auth.refreshSession({refresh_token})

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
  return user
};

export const register = async (registerDetails) => {
  const { user, session, error } = await supabase.auth.signUp(
    {
      email: registerDetails.email,
      password: registerDetails.password,
    },
    {
      data: {
        firstName: registerDetails.firstName,
        lastName: registerDetails.lastName,
      },
    }
  );

  if (error) {
    console.log("couldn't register,", error);
    return { user, session };
  }

  if (user && session) {
    return { user, session };
  }
};

export const signInStandard = async (loginDetails) => {
  const { user, session, error } = await supabase.auth.signIn({
    email: loginDetails.email,
    password: loginDetails.password,
  });

  if (error) {
    console.log("couldn't login,", error);
  }

  if (user && session) {
    return { user, session };
  }
};

export const signInFaceBook = async () => {
  const { user, session, error } = await supabase.auth.signIn({
    provider: 'facebook'
  });

  if (error) {
    console.log("couldn't login,", error);
  }

  if (user && session) {
    // console.log(user, session);
    return { user, session };
  }
};

export const signInGoogle = async () => {
  const { user, session, error } = await supabase.auth.signIn({
    provider: 'google'
  });

  console.log(user, session, error)
  if (error) {
    console.log("couldn't login,", error);
  }

  if (user && session) {
    // console.log(user, session);
    return { user, session };
  }
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.log("couldn't logout,", error);
  }
};
