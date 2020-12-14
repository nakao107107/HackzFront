export default async function ({ app, redirect }) {
  const token = (await app.$cookies.get('token'))
  if(!token){
    redirect('/auth/login')
  }
}
