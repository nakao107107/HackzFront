export default async function ({ app, store, redirect }) {
  const token = (await app.$cookies.get('token'))
  if(!token){
    redirect('/auth/login')
  }
  try {
    await store.dispatch('profile/fetch')
  } catch(e) {
    redirect('/auth/login')
  }
}
