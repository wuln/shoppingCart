window.onload=function(){
	if(!document.getElementsByClassName){
		document.getElementsByClassName=function(cls){
			var ret=[];
			var els=document.getElementsByTagName("*");
			for (var i = els.length - 1; i >= 0; i--) {
				if(els[i].className===cls||
					els[i].className.indexOf(" "+cls)>=0||
					els[i].className.indexOf(cls+" ")>=0||
					els[i].className.indexOf(" "+cls+" ")>=0){
					ret.push(els[i]);
				}
			}
			return ret;
		}
	}

	var cart=document.getElementById("cart");
	var goods=cart.children[1].rows;
	var checks=document.getElementsByClassName("check");
	var checkAlls=document.getElementsByClassName("check-all");
	var selected=document.getElementById("selected");
	var selectedCount=document.getElementById("selected-count");//已选商品数量
	var total=document.getElementById("total");					//已选商品金额
	var seletedViewList=document.getElementById("selectedViewList");
	var deleteAll=document.getElementById("delete-all");
	var foot=document.getElementById("foot");

	//获取已选商品的数量和金额
	function getTotal(){
		var count=0;
		var sum=0;
		var selectedHTML="";
		for (var i = goods.length - 1; i >= 0; i--) {
			if(goods[i].getElementsByTagName("input")[0].checked) {
				count+=parseInt(goods[i].getElementsByTagName("input")[1].value);
				sum+=parseFloat(goods[i].cells[4].innerHTML);
				selectedHTML+='<div><img src="'+goods[i].getElementsByTagName("img")[0].src+'"><span class="del" index="'+i+'">取消选择</span></div>';							  
			}
		}
		selectedCount.innerHTML=count;
		total.innerHTML=sum.toFixed(2);
		selectedViewList.innerHTML=selectedHTML;
		if (count == 0) {
            foot.className = 'foot';
        }
	}

	//显示已选商品列表
	selected.onclick=function(){
		if(foot.className=="foot"){
			if(selectedCount.innerHTML!="0"){
				foot.className="foot show";
			}
		}else{
			foot.className="foot";
		}
	}

	//已选商品列表添加事件代理
	selectedViewList.onclick=function(e){
		e=e||window.event;				//事件对象
		var el=e.target||e.srcElement;	//目标元素
		if(el.className=="del"){
			var index=el.getAttribute("index");
			var input=goods[index].getElementsByTagName("input")[0];
			input.checked=false;
			input.onclick();
		}
	}

	//给复选框添加点击事件
	for (var i = checks.length - 1; i >= 0; i--) {
		checks[i].onclick=function(){
			if(this.className==="check-all check"){
				for (var j = checks.length - 1; j >= 0; j--) {
					checks[j].checked=this.checked;
				}
			}else{
				if(!this.checked){
					for (var k = checkAlls.length - 1; k >= 0; k--) {
						checkAlls[k].checked=false;
					}
				}
			}
			getTotal();
		}
	}

	//获取小计金额
	function getSum(tr){
		var price=parseFloat(tr.cells[2].innerHTML);
		var count=parseInt(tr.getElementsByTagName("input")[1].value);		
		tr.cells[4].innerHTML=parseFloat(price*count).toFixed(2);
	}

	//商品行添加事件代理
	for (var i = goods.length - 1; i >= 0; i--) {
		goods[i].onclick=function(e){
			e=e||window.event;				//事件对象
			var el=e.target||e.srcElement;  //目标元素
			var cls=el.className;
			var inputCount=this.getElementsByTagName("input")[1];
			var countVal=parseInt(inputCount.value);
			var reduce=this.getElementsByTagName("span")[1];
			var isChecked=this.getElementsByTagName("input")[0].checked;
			switch(cls){
				case "add":
					inputCount.value=countVal+1;
					reduce.innerHTML="-";
					getSum(this);
					if (isChecked) {
						getTotal();
					}
					break;
				case "reduce":
					if(countVal>1){
						inputCount.value=countVal-1;
					}
					if(inputCount.value<=1){
						reduce.innerHTML="";
					}
					getSum(this);
					if (isChecked) {
						getTotal();
					}
					break;
				case "delete":
					var conf=confirm("确定要删除该商品吗？");
					if(conf){
						this.parentNode.removeChild(this);
					}
					if (isChecked) {
						getTotal();
					}
					break;
				default:
					break;		

			}
		}
	}

	//删除全部已选商品
	deleteAll.onclick=function(){
		if(selectedCount.innerHTML!="0"){
			var conf=confirm("确定要删除这些商品吗？");
			if(conf){
				for (var i = goods.length - 1; i >= 0; i--) {
					if(goods[i].getElementsByTagName("input")[0].checked) {
						goods[i].parentNode.removeChild(goods[i]);
						getTotal();
					}
				}
			}
			
		}else{
			alert("请选择商品！");
		}
	}

	checkAlls[0].checked=true;
	checkAlls[0].onclick();

};