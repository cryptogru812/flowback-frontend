import { fetchRequest } from '$lib/FetchRequest';

export interface Message {
	user: {
		id: number;
		username: string;
		profile_image: string | null;
	};
	active: boolean;
	attachments: null | File[];
	channel_id: number;
	channel_origin_name: 'workgroup' | string;
	channel_title: string;
	created_at: string;
	id: number;
	message: string;
	parent: number | null;
	topic_id: number | null;
	type: 'message' | 'info';
	updated_at: string;
}

export interface Message1 {
	active: boolean;
	attachments: null | File;
	channel_id: number;
	channel_origin_name: 'group' | 'user';
	created_at: String;
	id: number;
	message: string;
	parent: number;
	topic_id: number;
	type: 'message' | 'info';
	updated_at: String;
	user: { id: number; username: string; profile_image: string; banner_image: string };
}

//Taken from the preview API
export interface PreviewMessage {
	created_at: string;
	message: string;
	profile_image: string;
	timestamp: string;
	user_id: number;
	updated_at?: string;
	id: number;
	notified: boolean;
	//For group/preview
	group_id?: number;
	channel_id?: number;
	channel_title?: string;
	//For direct/preview
	user: {
		id: number;
		username: string;
		profile_image: string | null;
		banner_image: string | null;
	};
	target_id?: number;
	target_username?: string;
}

export interface Direct {
	id: number;
	profile_image: string | null;
	username: string;
}

//User has looked at a message, affects /preview primarily.
export const setTimeStamp = async (chatterId: number, selectedPage: 'direct' | 'group') => {
	fetchRequest('POST', `chat/${selectedPage}/${chatterId}/timestamp`, {
		timestamp: new Date()
	});
};


export interface invite {
	id: number;
	message_channel_id: number;
	message_channel_name: string;
	rejected: boolean | null;
	title: string;
}

export interface GroupMembers {
	banner_image: string | null;
	channel_id: number;
	chat_status: string;
	id: number;
	profile_image: string | null;
	public_status: string;
	username: string;
}
