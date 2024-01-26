export type Response =
	| {
			success: true;
	  }
	| {
			success: false;
			error: string;
	  };
