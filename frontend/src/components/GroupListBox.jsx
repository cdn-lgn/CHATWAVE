import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { userContext } from "../context/userContext";

const API_URL = import.meta.env.VITE_USER_API;

const GroupListBox = () => {
	const {
		theme,
		width,
		setRightComponent,
		setMainViewForMobile,
		setGroupForEdit,
	} = useContext(userContext);

	const [groupList, setGroupList] = useState([]);

	const handleClickOnGroup = ({ group }) => {
		console.log(group);
		setRightComponent("GroupSettings");
		setMainViewForMobile("GroupSettings");
		setGroupForEdit(group);
	};

	useEffect(() => {
		const fetchGroups = async () => {
			const allGroups = await axios.get(`${API_URL}/groups/fetchGroups`, {
				withCredentials: true,
			});
			// console.log(allGroups.data.allGroups);
			setGroupList(allGroups.data.allGroups);
		};
		fetchGroups();
		return () => {
			setGroupList([]);
		};
	}, []);

	return (
		<div
			style={{ backgroundColor: theme.background,color:theme.text }}
			className={`rounded-lg p-4 h-dvh relative flex flex-col gap-3 ${width <= 768 ? "min-w-full" : "w-1/3"}`} 
		>
		<h3>My Groups</h3>
			{groupList ? (
				Object.values(groupList).map((group, index) => (
					<div
						className="flex items-center gap-4 w-full rounded-lg cursor-pointer"
						style={{ background: theme.secondry }}
						onClick={() => handleClickOnGroup({ group })}
						key={index}
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
				))
			) : (
				<p>no group created yet by you</p>
			)}
		</div>
	);
};

export default GroupListBox;
