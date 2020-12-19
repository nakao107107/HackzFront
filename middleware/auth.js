export default async function ({ app, store, redirect }) {
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
    console.log(e)
    redirect('/auth/login')
  }
}
