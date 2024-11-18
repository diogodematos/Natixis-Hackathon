import React from 'react';

const Loading: React.FC = () => {
	return (
		<div className="flex items-center justify-center h-full">
			<div className="animate-spin rounded-full h-32 w-32 border-8 border-t-8 border-b-8 border-white border-opacity-50 border-t-transparent"></div>
		</div>
	);
};

export default Loading;
