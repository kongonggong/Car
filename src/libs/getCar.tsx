export default async function getCar(id:string) {
    const response = await fetch(`http://localhost:5003/api/cars/${id}`)
    if(!response.ok) {
        throw new Error("Failed to fetch cars")
    }

    return await response.json()
}