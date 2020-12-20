export default async function ({ app, store, route, redirect }) {
  if(route.path == '/auth/login' || route.path == '/auth/signup' || route.path == '/auth/registername'){
    return
  }
  const token = (await app.$cookies.get('token'))
  if(!token){
    redirect('/auth/login')
  }
  try {
    await store.dispatch('profile/fetch')
    const profile = store.getters['profile/profile']
    if(! profile.name){
      redirect('/auth/registername')
    }
  } catch(e) {
    redirect('/auth/login')
  }
}
