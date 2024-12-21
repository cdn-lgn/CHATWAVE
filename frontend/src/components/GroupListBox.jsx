import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { userContext } from "../context/userContext";

const GroupListBox = () => {
	const {
		theme,
		width,
		setRightComponent,
		setMainViewForMobile,
		setGroupForEdit,
	} = useContext(userContext);
	const groupList = useSelector((state) => state.user.user?.userCreatedGroups);
	const handleClickOnGroup = ({ group }) => {
		console.log(group);
		setRightComponent("GroupSettings");
		setMainViewForMobile("GroupSettings");
		setGroupForEdit(group);
	};

	return (
		<div
			style={{ backgroundColor: theme.background }}
			className={`p-4 h-full relative flex flex-col gap-3 ${width <= 768 ? "min-w-full" : "w-1/3"}`}
		>
			{groupList &&
				Object.values(groupList).map((group, index) => (
					<div
						className="flex items-center gap-4 w-full rounded-lg cursor-pointer"
						style={{ background: theme.secondry }}
						onClick={() => handleClickOnGroup({ group })}
					>
						{/* Profile Image */}
						<img
							src={group?.profileImage}
							alt={group?.name}
							className="w-12 h-12 rounded-full object-cover"
						/>

						{/* group? Details */}
						<div
							className="flex-1 min-w-0 relative"
							style={{ color: theme.text }}
						>
							<div className="w-full flex items-start justify-between flex-col">
								<h5 className="font-medium w-full  whitespace-nowrap overflow-hidden text-ellipsis">
									{group?.name}
								</h5>
								<p
									className="whitespace-nowrap overflow-hidden text-ellipsis w-full"
									style={{ color: theme.mutedText }}
								>
									{group?.description}
								</p>
							</div>
						</div>
					</div>
				))}
		</div>
	);
};

export default GroupListBox;
