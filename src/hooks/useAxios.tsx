
import axios from "axios";
import Cookies from "js-cookie";
const instance = axios.create({
	baseURL: import.meta.env.VITE_BASE_URL,
});

interface AxiosProps {
	url: string;
	method: string;
	body?: object;
	headers?: object;
	params?: object;
}

export const useAxios = () => {
    const token = Cookies.get("accessToken")
	const response = async ({ url, method = "GET", body, headers, params }: AxiosProps) => {
		try {
			const res = await instance({
				url,
				method,
				data: body,
				headers: {
					"Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
					...headers,
				},
				params: {
					...params
				},
			});
			
			return res.data;
		} catch (err) {
			console.log("API Error:", err);
			throw err;
		}
	};

	return response;
};
