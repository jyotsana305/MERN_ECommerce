import { createSlice,createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

//Register API

export const register = createAsyncThunk('user/register', async (userData, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-type': 'multipart/form-data'
            }
        };
        const { data } = await axios.post('/api/v1/register', userData, config);
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Registration failed.PLease try again later');
    }
});
//login API
export const login = createAsyncThunk('user/login', async ({email,password}, { rejectWithValue }) => {
    try {
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        };
        const { data } = await axios.post('/api/v1/login',{email,password}, config);
        console.log('Login data',data)
        return data;
    } catch (error) {
        return rejectWithValue(error.response?.data || 'Login failed.PLease try again later');
    }
});
export const loadUser=createAsyncThunk('user/loadUser',async(__,{rejectWithValue})=>{
    try{
      const {data}=await axios.get('/api/v1/profile');
      return data
    }catch (error) {
        return rejectWithValue(error.response?.data || 'Failed to load user profile');
    }
})
export const logout=createAsyncThunk('user/logout',async(__,{rejectWithValue})=>{
    try{
      const {data}=await axios.post('/api/v1/logout',{},{withCredentials:true});
      return data
    }catch (error) {
        return rejectWithValue(error.response?.data || 'Registration failed.PLease try again later');
    }
})
export const updateProfile=createAsyncThunk('user/updateProfile',async(userData,{rejectWithValue})=>{
    try{
        const config = {
            headers: {
                'Content-type': 'multipart/form-data'
            }
        };
        const { data } = await axios.put('/api/v1/profile/update', userData, config);
        return data
    }catch (error) {
        return rejectWithValue(error.response?.data || {message:'Profile update failed.Please try again later'});
    }
})
export const updatePassword=createAsyncThunk('user/updatePassword',async(formData,{rejectWithValue})=>{
    try{
        const config = {
            headers: {
                'Content-type': 'multipart/form-data'
            }
        };
        const { data } = await axios.put('/api/v1/password/update', formData, config);
        return data
    }catch (error) {
        return rejectWithValue(error.response?.data || {message:'Password Update Failed.'});
    }
})
export const forgotPassword=createAsyncThunk('user/forgotPassword',async(email,{rejectWithValue})=>{
    try{
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        };
        const { data } = await axios.post('/api/v1/password/forgot', email, config);
        return data
    }catch (error) {
        return rejectWithValue(error.response?.data || {message:'Password Update Failed.'});
    }
})
export const resetPassword=createAsyncThunk('user/resetPassword',async({token,userData},{rejectWithValue})=>{
    try{
        const config = {
            headers: {
                'Content-type': 'application/json'
            }
        };
        const { data } = await axios.post(`/api/v1/reset/${token}`, userData, config);
        return data
    }catch (error) {
        return rejectWithValue(error.response?.data || {message:'Password Update Failed.'});
    }
})
//Admin
export const adminUsers=createAsyncThunk('user/adminUsers',async(__,{rejectWithValue})=>{
    try{
        const {data}=await axios.get('/api/v1/admin/users');
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || {message:'Failed to load users'});
    }
})
export const getSingleUserAdmin=createAsyncThunk('user/getSingleUserAdmin',async(id,{rejectWithValue})=>{
    try{
        const {data}=await axios.get(`/api/v1/admin/user/${id}`);
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || {message:'Failed to load user'});
    }
})
export const updateUserRole=createAsyncThunk('user/updateUserRole',async({id,role},{rejectWithValue})=>{
    try{
        const config = {headers: {'Content-type': 'application/json'}};
        const {data}=await axios.put(`/api/v1/admin/user/${id}`,{role},config);
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || {message:'Failed to update user role'});
    }
})
export const deleteUserAdmin=createAsyncThunk('user/deleteUserAdmin',async(id,{rejectWithValue})=>{
    try{
        const {data}=await axios.delete(`/api/v1/admin/user/${id}`);
        return data;
    }catch(error){
        return rejectWithValue(error.response?.data || {message:'Failed to delete user'});
    }
})
const userSlice=createSlice({
    name:'user',
    initialState:{
        user:null,
        users:[],
        singleUser:null,
        loading:false,
        // Whether the initial session-restore (loadUser, dispatched once on
        // app mount) has finished. ProtectedRoutes waits for this before
        // deciding whether to redirect to /login - without it, a hard reload
        // of a protected route would see the default isAuthenticated:false
        // and bounce the user away before the auth cookie was even checked.
        authChecked:false,
        error:null,
        success:false,
        isAuthenticated:false,
        message:null
    },
    reducers:{
        removeErrors:(state)=>{
            state.error=null
        },
         removeSuccess:(state)=>{
            state.success=null
        },
    },
    extraReducers:(builder)=>{
        //registration cases
        builder
        .addCase(register.pending,(state)=>{
            state.loading=true,
            state.error=null
        })
        .addCase(register.fulfilled,(state,action)=>{
            state.loading=false,
            state.error=null,
            state.success=action.payload.success
            state.user=action.payload?.user ||null
            state.isAuthenticated=Boolean(action.payload?.user)
        })
         .addCase(register.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload?.message ||'Registration failed.Please try again later'
            state.user=null
            state.isAuthenticated=false
        })
       //loadUser cases
        builder
        .addCase(loadUser.pending,(state)=>{
            state.loading=true,
            state.error=null
        })
        .addCase(loadUser.fulfilled,(state,action)=>{
            state.loading=false,
            state.error=null,
            state.authChecked=true
            state.user=action.payload?.user ||null
            state.isAuthenticated=Boolean(action.payload?.user)
        })
         .addCase(loadUser.rejected,(state)=>{
            // loadUser runs on every page load to silently restore a session
            // from the auth cookie - failing just means "not logged in" (no
            // cookie, or an expired/invalid one). That's not toast-worthy, and
            // every page's own error-toast effect watches this same `error`
            // field, so setting it here would surface a scary "invalid token"
            // message on whatever page the user happens to be on, including
            // the login page itself.
            state.loading=false
            state.authChecked=true
            state.user=null
            state.isAuthenticated=false
        })
        //login cases
        builder
        .addCase(login.pending,(state)=>{
            state.loading=true,
            state.error=null
        })
        .addCase(login.fulfilled,(state,action)=>{
            state.loading=false,
            state.error=null,
            state.success=action.payload.success
            state.user=action.payload?.user ||null
            state.isAuthenticated=Boolean(action.payload?.user)
            console.log(state.user);
        })
         .addCase(login.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload?.message ||'Login failed.Please try again later'
            state.user=null
            state.isAuthenticated=false
        })
        //logout cases
        builder
        .addCase(logout.pending,(state)=>{
            state.loading=true,
            state.error=null
        })
        .addCase(logout.fulfilled,(state,action)=>{
            state.loading=false,
            state.error=null,
            state.user=null,
            state.isAuthenticated=false
        })
         .addCase(logout.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload?.message || 'Failed to load user profile'
        })
        //Update User Profile
        builder
        .addCase(updateProfile.pending,(state)=>{
            state.loading=true,
            state.error=null
        })
        .addCase(updateProfile.fulfilled,(state,action)=>{
            state.loading=false,
            state.error=null,
            state.user=action.payload?.user || null
            state.success=action.payload?.success
            state.message=action.payload?.message

        })
         .addCase(updateProfile.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload?.message || 'Profile update failed.Please try again later'
        })
        //Update Password
        builder
        .addCase(updatePassword.pending,(state)=>{
            state.loading=true,
            state.error=null
        })
        .addCase(updatePassword.fulfilled,(state,action)=>{
            state.loading=false,
            state.error=null,
            state.success=action.payload?.success
        })
         .addCase(updatePassword.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload?.message || 'Password Update Failed.'
        })
        //forgot password
        builder
        .addCase(forgotPassword.pending,(state)=>{
            state.loading=true,
            state.error=null
        })
        .addCase(forgotPassword.fulfilled,(state,action)=>{
            state.loading=false,
            state.error=null,
            state.success=action.payload?.success
            state.message=action.payload?.message
        })
         .addCase(forgotPassword.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload?.message || 'Email sent Failed'
        })
         //reset password
        builder
        .addCase(resetPassword.pending,(state)=>{
            state.loading=true,
            state.error=null
        })
        .addCase(resetPassword.fulfilled,(state,action)=>{
            state.loading=false,
            state.error=null,
            state.success=action.payload?.success
            state.user=null,
            state.isAuthenticated=false
        })
         .addCase(resetPassword.rejected,(state,action)=>{
            state.loading=false,
            state.error=action.payload?.message || 'Email sent Failed'
        })
        //admin - all users
        builder
        .addCase(adminUsers.pending,(state)=>{
            state.loading=true
            state.error=null
        })
        .addCase(adminUsers.fulfilled,(state,action)=>{
            state.loading=false
            state.users=action.payload.users
        })
        .addCase(adminUsers.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload?.message || 'Failed to load users'
        })
        //admin - single user
        builder
        .addCase(getSingleUserAdmin.pending,(state)=>{
            state.loading=true
            state.error=null
        })
        .addCase(getSingleUserAdmin.fulfilled,(state,action)=>{
            state.loading=false
            state.singleUser=action.payload.user
        })
        .addCase(getSingleUserAdmin.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload?.message || 'Failed to load user'
        })
        //admin - update user role
        builder
        .addCase(updateUserRole.pending,(state)=>{
            state.loading=true
            state.error=null
        })
        .addCase(updateUserRole.fulfilled,(state,action)=>{
            state.loading=false
            state.success=action.payload.success
            state.singleUser=action.payload.user
        })
        .addCase(updateUserRole.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload?.message || 'Failed to update user role'
        })
        //admin - delete user
        builder
        .addCase(deleteUserAdmin.pending,(state)=>{
            state.loading=true
            state.error=null
        })
        .addCase(deleteUserAdmin.fulfilled,(state,action)=>{
            state.loading=false
            state.success=action.payload.success
            state.message=action.payload.message
        })
        .addCase(deleteUserAdmin.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload?.message || 'Failed to delete user'
        })

    }
})
export const {removeErrors,removeSuccess}=userSlice.actions;
export default userSlice.reducer;