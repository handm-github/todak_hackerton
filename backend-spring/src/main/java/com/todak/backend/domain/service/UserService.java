package com.todak.backend.domain.service;

import java.util.List;
import java.util.Random;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;

import com.todak.backend.domain.entity.user.User;
import com.todak.backend.domain.entity.user.UserRole;
import com.todak.backend.domain.entity.user.dto.CounselorUserResponse;
import com.todak.backend.domain.entity.user.dto.UserLoginRequest;
import com.todak.backend.domain.entity.user.dto.UserLoginResponse;
import com.todak.backend.domain.entity.user.dto.UserSignupRequest;
import com.todak.backend.domain.repository.UserRepository;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

	private final UserRepository userRepository;

	private final WebClient webClient;

	@Transactional
	public void signUp(UserSignupRequest request) {
		existsByUsername(request.getUsername());
		userRepository.save(User.builder()
			.username(request.getUsername())
			.pw(request.getPw())
			.nick(request.getNick())
			.role(UserRole.USER)
			.build());
	}

	public UserLoginResponse login(UserLoginRequest request) {
		User user = findByUser(request.getUsername(), request.getPw());
		return UserLoginResponse.from(user);
	}

	public String fortune() {

		try {
			return webClient.get()
				.uri("/api/v1/users/fortune/daily")
				.retrieve()
				.bodyToMono(String.class)
				.block();
		} catch (Exception e) {
			int idx = new Random().nextInt(fallbackFortunes.size());
			return fallbackFortunes.get(idx);
		}
	}

	public void existsByUsername(String username) {
		if (userRepository.existsByUsername(username)) {
			throw new RuntimeException("이미 존재하는 유저아이디입니다.");
		}
	}

	public User findByUser(String username, String pw) {
		return userRepository.findByUsernameAndPw(username, pw).orElseThrow(()-> new RuntimeException("아이디 또는 비밀번호가 틀렸습니다."));
	}

	public User findById(Long id) {
		return userRepository.findById(id).orElseThrow(()-> new RuntimeException("존재 하지 않는 유저 입니다."));
	}

	@Transactional(readOnly = true)
	public List<CounselorUserResponse> getExperts(HttpSession session) {
		var sessionUserResponse = (UserLoginResponse)session.getAttribute("user");

		User user = findById(sessionUserResponse.getUserId());
		if(user.getRole().equals(UserRole.COUNSELOR)) {
			throw new RuntimeException("상담자는 상담 할 수 없습니다");
		}
		return userRepository.findByRole(UserRole.COUNSELOR).stream().map(CounselorUserResponse::from).toList();
	}

	private final List<String> fallbackFortunes = List.of(
		"오늘의 힘찬 하루를 응원합니다! 좋은 일이 생길거예요!",
		"어려운 시간이 지나면 반드시 밝은 내일이 기다리고 있어요.",
		"당신의 노력은 헛되지 않을 것입니다. 조금만 더 힘내세요!",
		"오늘 하루도 당신이 소중한 존재라는 것을 잊지 마세요.",
		"작은 변화가 큰 행복을 가져다 줄 거예요.",
		"힘든 시간도 당신을 더 강하게 만들어 줄 거예요.",
		"오늘은 새로운 시작을 위한 완벽한 날입니다.",
		"당신이 가는 길 위에 따뜻한 햇살이 늘 함께하길 바랍니다.",
		"오늘의 선택이 내일의 큰 기회를 만들어 줄 것입니다.",
		"지금의 노력이 미래의 자신을 웃게 만들 거예요.",
		"당신의 진심은 언젠가 반드시 빛을 발할 거예요.",
		"당신의 미소는 누군가에게 큰 힘이 됩니다.",
		"어제의 어려움이 오늘의 성장으로 이어지고 있습니다.",
		"당신의 가능성은 무한하며, 아직 시작에 불과합니다.",
		"마음의 여유를 가지면 새로운 길이 보일 거예요.",
		"한 걸음씩 나아가는 당신의 발걸음이 세상을 바꿉니다.",
		"작은 친절이 큰 기적을 만들어 냅니다.",
		"당신의 따뜻한 마음이 주변 사람들을 밝게 만듭니다.",
		"기다림 끝에는 늘 좋은 소식이 찾아옵니다.",
		"포기하지 않는 당신의 용기가 모두를 감동시킵니다.",
		"오늘의 작은 행복이 내일의 큰 희망이 됩니다.",
		"하루를 진심으로 살아가는 것만으로도 충분히 빛납니다.",
		"어려움은 당신을 더 단단하게 만들어 주는 선물입니다.",
		"새로운 도전이 당신을 한층 더 성장하게 합니다.",
		"당신의 꿈은 반드시 현실이 될 힘을 가지고 있습니다.",
		"마음의 평화가 행복의 시작입니다.",
		"당신의 따뜻한 말 한마디가 누군가의 하루를 바꿀 수 있습니다."
	);


}
