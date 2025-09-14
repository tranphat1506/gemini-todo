// src/features/auth/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { User } from "firebase/auth";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from "firebase/auth";
import { auth, googleProvider } from "@/app/firebase";

// ================== Types ==================
export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Hàm parse từ Firebase User sang AuthUser của app
export const parseUser = (user: User | null): AuthUser | null => {
  if (!user) return null;
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL || "/default_avatar.webp",
  };
};

// ================== Async Actions ==================

// Đăng nhập bằng email
export const login = createAsyncThunk<
  AuthUser,
  { email: string; password: string },
  { rejectValue: string }
>("auth/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    const userCred = await signInWithEmailAndPassword(auth, email, password);
    return parseUser(userCred.user)!;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

// Đăng ký bằng email
export const register = createAsyncThunk<
  AuthUser,
  { email: string; password: string; displayName: string },
  { rejectValue: string }
>(
  "auth/register",
  async ({ email, password, displayName }, { rejectWithValue }) => {
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName,
          photoURL: "/default_avatar.webp",
        });
      }

      return parseUser(userCred.user)!;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Đăng nhập bằng Google
export const loginWithGoogle = createAsyncThunk<
  AuthUser,
  void,
  { rejectValue: string }
>("auth/loginWithGoogle", async (_, { rejectWithValue }) => {
  try {
    const userCred = await signInWithPopup(auth, googleProvider);
    return parseUser(userCred.user)!;
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

// Đăng xuất
export const logout = createAsyncThunk<void, void, { rejectValue: string }>(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

// Thunk mới để lắng nghe trạng thái xác thực
export const listenToAuthChanges = createAsyncThunk(
  "auth/listenToAuthChanges",
  (_, { dispatch }) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // Người dùng đã đăng nhập, dispatch action cập nhật state
        dispatch(setUser(parseUser(user)));
      } else {
        // Người dùng đã đăng xuất
        dispatch(clearUser());
      }
      dispatch(setAuthReady(true));
    });
  }
);

// ================== Slice ==================
interface AuthState {
  user: AuthUser | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  isAuthReady: boolean;
}

const initialState: AuthState = {
  user: null,
  status: "idle",
  error: null,
  isAuthReady: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser | null>) {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
      state.status = "idle";
    },
    setAuthReady: (state, action: PayloadAction<boolean>) => {
      state.isAuthReady = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Đăng nhập thất bại";
      })
      // Register
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Đăng ký thất bại";
      })
      // Google login
      .addCase(loginWithGoogle.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Đăng nhập Google thất bại";
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.status = "idle";
      });
  },
});

export const { setUser, clearUser, setAuthReady } = authSlice.actions;
export default authSlice.reducer;
