export default async function getCouponsForUser(token: string){


    let url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/coupons`;

    // // console.log(url)
    // const response = await fetch(url, {
    //     method: 'GET',
    //     headers: {
    //         Authorization: `Bearer ${token}`,
    //     },
    // });
    // if (!response.ok) {
    //   throw new Error("Failed to fetch coupons");
    // }
    // return await response.json();

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch coupons");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching coupons:", error);
        throw error;
    }
}
  