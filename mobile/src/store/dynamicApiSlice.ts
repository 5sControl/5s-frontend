import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Cookies } from 'react-cookie';
import { CollectionMeta } from '../pages/directories-dynamic/Meta';

export const dynamicApiSlice = createApi({
	reducerPath: 'api',
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.VITE_API_BASE_URL,
		prepareHeaders: (headers) => {
			const cookies = new Cookies();
			const token = cookies.get('token');
			if (token) {
				// console.log(token)
				headers.set('Authorization', `${token}`),
				headers.set("ngrok-skip-browser-warning", 'true')
			}
			return headers
		},
	}),
	endpoints: (builder) => ({
		getCollection: builder.query({
			query: (meta: CollectionMeta) => ({ url: meta.url, method: 'GET' })
		}),
		getCollectionItem: builder.query<{ [key: string]: any }[], any>({
			query: (params: { meta: CollectionMeta, itemId: number }) => ({ url: params.meta.url + `${params.itemId}/`, method: 'GET' })
		}),
		addCollectionItem: builder.mutation({
			query: (params: { meta: CollectionMeta, items: Map<string, any> }) => {
				const body = Object.fromEntries(params.items)
				return { url: params.meta.url, body, method: 'POST' }
			}
		}),
		updateCollectionItem: builder.mutation({
			query: (params: { meta: CollectionMeta, updates: Map<string, any>, itemId: number }) => {
				const body = Object.fromEntries(params.updates)
				return { url: params.meta.url + `${params.itemId}/`, body, method: 'PATCH' }
			}
		}),
		deleteCollectionItem: builder.mutation({
			query: (params: { meta: CollectionMeta, itemId: number }) => ({ url: params.meta.url + `${params.itemId}/`, method: 'DELETE' })
		})
	}),
})

export const { useGetCollectionQuery, useGetCollectionItemQuery } = dynamicApiSlice