import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { 
  signInWithEmailAndPassword,
  deleteUser,
  User
} from 'firebase/auth'
import { auth } from '../../main'

interface AuthState {
  user: User | null
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ email, password }: { email: string, password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteCurrentUser = createAsyncThunk(
  'auth/deleteUser',
  async (_, { rejectWithValue }) => {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) throw new Error('No user logged in')
      await deleteUser(currentUser)
      return null
    } catch (error: any) {
      return rejectWithValue(error.message)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.loading = false
      state.error = null
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
      .addCase(deleteCurrentUser.fulfilled, (state) => {
        state.user = null
        state.loading = false
        state.error = null
      })
      .addCase(deleteCurrentUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
      })
  }
})

export const { setUser, clearError } = authSlice.actions
export default authSlice.reducer