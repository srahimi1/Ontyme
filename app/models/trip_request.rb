class TripRequest < ApplicationRecord
	belongs_to :user

	@digits = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z']
	@reverse_digits = {'0'=>0,'1'=>1,'2'=> 2,'3'=>3,'4'=>4,'5'=>5,'6'=>6,'7'=>7,'8'=>8,'9'=>9,'a'=>10,'b'=>11,'c'=>12,'d'=>13,'e'=>14,'f'=>15,'g'=>16,'h'=>17,'i'=>18,'j'=>19,'k'=>20,'l'=>21,'m'=>22,'n'=>23,'o'=>24,'p'=>25,'q'=>26,'r'=>27,'s'=>28,'t'=>29,'u'=>30,'v'=>31,'w'=>32,'x'=>33,'y'=>34,'z'=>35,'A'=>36,'B'=>37,'C'=>38,'D'=>39,'E'=>40,'F'=>41,'G'=>42,'H'=>43,'I'=>44,'J'=>45,'K'=>46,'L'=>47,'M'=>48,'N'=>49,'O'=>50,'P'=>51,'Q'=>52,'R'=>53,'S'=>54,'T'=>55,'U'=>56,'V'=>57,'W'=>58,'X'=>59,'Y'=>60,'Z'=>61}
	
	def create_id
		@last = TripRequest.order("created_at").last
		@tmp_id = ""
		if (!!@last)
			@tmp_id2 = @last.trip_request_id
			@last_value = @tmp_id2[-1]
			@tmp_id2 = @tmp_id2.chop
			new_index = @reverse_digits[@last_value] + 1
			if (new_index == 62)
				new_index = 0
				@carry = 1
			else
				@carry = 0
			end
			@tmp_id = @digts[new_index] + @tmp_id
			while (@tmp_id2.length > 0)
				@last_value = @tmp_id2[-1]
				@tmp_id2 = @tmp_id2.chop
				new_index = @reverse_digits[@last_value] + @carry
				if (new_index == 62)
					new_index = 0
					@carry = 1
				else
					@carry = 0
				end
				@tmp_id = @digts[new_index] + @tmp_id
			end
		else
			@tmp_id = "000000000000000000000000000000"
		end
		return @tmp_id
	end






end
