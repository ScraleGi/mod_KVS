// 'use server'

// export async function myAction() {
//   console.log('hello vorarlberg!')
// }


'use server'

export async function updateUser(userId: string, formData: FormData) {
    const name = formData.get('name')
    console.log('User ID:', userId, 'New Name:', name)
}